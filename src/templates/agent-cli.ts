/**
 * Generates the agent CLI script (agent.sh) that gets included in the ZIP.
 * Full agent runtime with task management, heartbeat, costs, and comments.
 */
export function generateAgentCli(supabaseUrl: string): string {
  return `#!/usr/bin/env bash
# Agent CLI — task loop interface for AI coding agents
# Usage: ./scripts/agent.sh <action> [args]
#
# Actions:
#   next                    Get next pending task (respects dependencies)
#   claim <task_code>       Claim a task (mark in_progress)
#   complete <task_code>    Mark task completed
#   block <task_code> "msg" Mark task blocked with reason
#   status                  Show overall progress
#   list [--phase X]        List tasks with optional filters
#   loop                    Full autonomous loop: next → claim → (work) → complete

set -euo pipefail

SUPABASE_URL="\${SUPABASE_URL:-${supabaseUrl || '${SUPABASE_URL}'}}"
AGENT_TASKS_URL="\${SUPABASE_URL}/functions/v1/agent-tasks"
AGENT_ID="\${AGENT_ID:-claude-code}"

# Auth: use SUPABASE_ACCESS_TOKEN or fall back to anon key
TOKEN="\${SUPABASE_ACCESS_TOKEN:-\${SUPABASE_ANON_KEY:-}}"

if [ -z "$TOKEN" ]; then
  echo "ERROR: Set SUPABASE_ACCESS_TOKEN (user JWT) or SUPABASE_ANON_KEY"
  echo "  export SUPABASE_ACCESS_TOKEN=\\$(npx supabase auth token)"
  exit 1
fi

call_api() {
  local body="$1"
  curl -s -X POST "$AGENT_TASKS_URL" \\
    -H "Authorization: Bearer $TOKEN" \\
    -H "Content-Type: application/json" \\
    -H "apikey: \${SUPABASE_ANON_KEY:-$TOKEN}" \\
    -d "$body"
}

case "\${1:-help}" in
  next)
    echo "Querying next task for agent: $AGENT_ID"
    result=$(call_api "{\\"action\\":\\"next\\",\\"agent_id\\":\\"$AGENT_ID\\"}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  claim)
    [ -z "\${2:-}" ] && echo "Usage: agent.sh claim <task_code>" && exit 1
    echo "Claiming task: $2"
    result=$(call_api "{\\"action\\":\\"claim\\",\\"task_code\\":\\"$2\\"}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  complete)
    [ -z "\${2:-}" ] && echo "Usage: agent.sh complete <task_code> [notes]" && exit 1
    notes="\${3:-}"
    echo "Completing task: $2"
    result=$(call_api "{\\"action\\":\\"complete\\",\\"task_code\\":\\"$2\\",\\"notes\\":\\"$notes\\"}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  block)
    [ -z "\${2:-}" ] && echo "Usage: agent.sh block <task_code> \\"reason\\"" && exit 1
    [ -z "\${3:-}" ] && echo "Usage: agent.sh block <task_code> \\"reason\\"" && exit 1
    echo "Blocking task: $2"
    result=$(call_api "{\\"action\\":\\"block\\",\\"task_code\\":\\"$2\\",\\"notes\\":\\"$3\\"}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  status)
    result=$(call_api "{\\"action\\":\\"status\\"}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  list)
    filter=""
    [ -n "\${2:-}" ] && filter=",\\"phase\\":\\"$2\\""
    result=$(call_api "{\\"action\\":\\"list\\"$filter}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  loop)
    echo "=== AUTONOMOUS AGENT LOOP ==="
    echo "Agent: $AGENT_ID"
    echo ""
    while true; do
      # 1. Get next task
      result=$(call_api "{\\"action\\":\\"next\\",\\"agent_id\\":\\"$AGENT_ID\\"}")
      task_code=$(echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); t=d.get('task'); print(t['task_code'] if t else '')" 2>/dev/null)

      if [ -z "$task_code" ]; then
        msg=$(echo "$result" | python3 -c "import sys,json; print(json.load(sys.stdin).get('message',''))" 2>/dev/null)
        echo "No eligible task. $msg"
        echo "Loop complete."
        break
      fi

      # 2. Get task details
      title=$(echo "$result" | python3 -c "import sys,json; print(json.load(sys.stdin)['task']['title'])" 2>/dev/null)
      wat=$(echo "$result" | python3 -c "import sys,json; refs=json.load(sys.stdin)['task'].get('wat_references',[]); print(' '.join(refs))" 2>/dev/null)
      echo "────────────────────────────────────────"
      echo "TASK: $task_code — $title"
      [ -n "$wat" ] && echo "LOAD: $wat"
      echo ""

      # 3. Claim
      call_api "{\\"action\\":\\"claim\\",\\"task_code\\":\\"$task_code\\"}" > /dev/null

      # 4. Pause for agent to do the work
      echo "Task claimed. Do the work, then press ENTER to mark complete (or type 'block <reason>' / 'skip'):"
      read -r response

      if [[ "$response" == block* ]]; then
        reason="\${response#block }"
        call_api "{\\"action\\":\\"block\\",\\"task_code\\":\\"$task_code\\",\\"notes\\":\\"$reason\\"}" > /dev/null
        echo "Blocked: $reason"
      elif [[ "$response" == "skip" ]]; then
        echo "Skipped."
      else
        # 5. Verify build
        echo "Verifying: tsc --noEmit && npm run build"
        if npx tsc --noEmit 2>/dev/null && npm run build --silent 2>/dev/null; then
          call_api "{\\"action\\":\\"complete\\",\\"task_code\\":\\"$task_code\\"}" > /dev/null
          echo "Completed + verified."
        else
          echo "Build failed. Task stays in_progress."
        fi
      fi
      echo ""
    done

    # Final status
    echo ""
    echo "=== FINAL STATUS ==="
    call_api "{\\"action\\":\\"status\\"}" | python3 -m json.tool 2>/dev/null
    ;;

  comment)
    [ -z "\${2:-}" ] && echo "Usage: agent.sh comment <task_code> \\"message\\"" && exit 1
    [ -z "\${3:-}" ] && echo "Usage: agent.sh comment <task_code> \\"message\\"" && exit 1
    echo "Adding comment to: $2"
    result=$(call_api "{\\"action\\":\\"comment\\",\\"task_code\\":\\"$2\\",\\"body\\":\\"$3\\",\\"author\\":\\"$AGENT_ID\\"}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  comments)
    [ -z "\${2:-}" ] && echo "Usage: agent.sh comments <task_code>" && exit 1
    result=$(call_api "{\\"action\\":\\"comments\\",\\"task_code\\":\\"$2\\"}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  register)
    echo "Registering agent: $AGENT_ID"
    budget="\${2:-0}"
    result=$(call_api "{\\"action\\":\\"agent:register\\",\\"agent_id\\":\\"$AGENT_ID\\",\\"budget_monthly_cents\\":$budget}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  pause)
    echo "Pausing agent: $AGENT_ID"
    result=$(call_api "{\\"action\\":\\"agent:pause\\",\\"agent_id\\":\\"$AGENT_ID\\",\\"reason\\":\\"\${2:-manual pause}\\"}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  resume)
    echo "Resuming agent: $AGENT_ID"
    result=$(call_api "{\\"action\\":\\"agent:resume\\",\\"agent_id\\":\\"$AGENT_ID\\"}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  heartbeat)
    echo "Starting heartbeat for: $AGENT_ID"
    task_code="\${2:-}"
    body="{\\"action\\":\\"heartbeat:start\\",\\"agent_id\\":\\"$AGENT_ID\\"}"
    [ -n "$task_code" ] && body="{\\"action\\":\\"heartbeat:start\\",\\"agent_id\\":\\"$AGENT_ID\\",\\"task_code\\":\\"$task_code\\"}"
    result=$(call_api "$body")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  cost)
    [ -z "\${2:-}" ] && echo "Usage: agent.sh cost <cents> <provider> <model>" && exit 1
    cents="$2"
    provider="\${3:-anthropic}"
    model="\${4:-claude-opus-4-20250514}"
    result=$(call_api "{\\"action\\":\\"cost:record\\",\\"agent_id\\":\\"$AGENT_ID\\",\\"cost_cents\\":$cents,\\"provider\\":\\"$provider\\",\\"model\\":\\"$model\\"}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  costs)
    days="\${2:-30}"
    result=$(call_api "{\\"action\\":\\"cost:summary\\",\\"agent_id\\":\\"$AGENT_ID\\",\\"days\\":$days}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  activity)
    limit="\${2:-20}"
    result=$(call_api "{\\"action\\":\\"activity:list\\",\\"limit\\":$limit}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  wakeup)
    reason="\${2:-scheduled}"
    result=$(call_api "{\\"action\\":\\"wakeup:request\\",\\"agent_id\\":\\"$AGENT_ID\\",\\"reason\\":\\"$reason\\",\\"idempotency_key\\":\\"$AGENT_ID-\$(date +%Y%m%d%H)\\"}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  dashboard)
    result=$(call_api "{\\"action\\":\\"dashboard\\"}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  doctor)
    echo "Running health checks..."
    result=$(call_api "{\\"action\\":\\"doctor\\"}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  config)
    [ -z "\${2:-}" ] && echo "Usage: agent.sh config <key> <value>" && exit 1
    [ -z "\${3:-}" ] && echo "Usage: agent.sh config <key> <value>" && exit 1
    result=$(call_api "{\\"action\\":\\"config:update\\",\\"agent_id\\":\\"$AGENT_ID\\",\\"config\\":{\\"$2\\":$3}}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  config-history)
    result=$(call_api "{\\"action\\":\\"config:history\\",\\"agent_id\\":\\"$AGENT_ID\\"}")
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    ;;

  *)
    echo "Agent CLI — Full agent runtime interface"
    echo ""
    echo "Usage: ./scripts/agent.sh <action> [args]"
    echo ""
    echo "Task Actions:"
    echo "  next                      Get next pending task"
    echo "  claim <task_code>         Claim a task (atomic, race-safe)"
    echo "  complete <task_code>      Mark completed"
    echo "  block <task_code> \\"msg\\"   Mark blocked"
    echo "  status                    Overall progress"
    echo "  list [phase]              List tasks"
    echo "  loop                      Autonomous work loop"
    echo ""
    echo "Comment Actions:"
    echo "  comment <task_code> \\"msg\\" Add a comment"
    echo "  comments <task_code>      List comments"
    echo ""
    echo "Agent Actions:"
    echo "  register [budget_cents]   Register this agent"
    echo "  pause [reason]            Pause this agent"
    echo "  resume                    Resume this agent"
    echo "  config <key> <value>      Update agent config"
    echo "  config-history            View config change history"
    echo ""
    echo "Runtime Actions:"
    echo "  heartbeat [task_code]     Start a heartbeat run"
    echo "  cost <cents> [provider] [model]  Record a cost event"
    echo "  costs [days]              Cost summary"
    echo "  activity [limit]          Recent activity log"
    echo "  wakeup [reason]           Request agent wakeup"
    echo ""
    echo "Diagnostics:"
    echo "  dashboard                 Aggregated status overview"
    echo "  doctor                    Health check all systems"
    echo ""
    echo "Environment:"
    echo "  SUPABASE_URL              Supabase project URL"
    echo "  SUPABASE_ACCESS_TOKEN     User JWT"
    echo "  AGENT_ID                  Agent name (default: claude-code)"
    ;;
esac
`;
}
