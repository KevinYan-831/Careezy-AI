# Coaching Messages Storage Optimization

## Problem
Storing every coaching message in Supabase can quickly consume storage quota, especially with limited free tier plans.

## Solution
Implement a smart storage strategy that balances context preservation with storage efficiency:

### 1. **Rolling Message Window**
- Keep only the **last 20 messages** per session
- Automatically delete older messages via database trigger
- Provides sufficient context for most conversations

### 2. **Context Summaries**
- Every 20 messages, generate an AI summary of the conversation
- Store summary in `coaching_sessions.context_summary`
- Summary captures: user goals, challenges, and key advice given
- Used as system message context for future interactions

### 3. **Message Count Tracking**
- Track total messages exchanged in `coaching_sessions.message_count`
- Used to trigger summary updates
- Helps monitor usage patterns

## How It Works

### Storage Flow:
```
User sends message
  ↓
Store user + AI messages (both)
  ↓
Auto-cleanup: Keep only last 20 messages
  ↓
Every 20 messages → Generate summary
  ↓
Use summary + recent messages for context
```

### Context Building:
```
AI receives:
1. System message with conversation summary (if exists)
2. Last 15 actual messages
3. Current user message

Total context: ~16-17 messages instead of potentially 100+
```

## Storage Savings

### Before Optimization:
- 100 message session = 100 messages stored
- Average message size: ~200-500 characters
- Total: 20-50 KB per session

### After Optimization:
- 100 message session = 20 messages + 1 summary stored
- 20 messages: 4-10 KB
- 1 summary: ~0.5 KB
- Total: 4.5-10.5 KB per session
- **Savings: ~50-80% reduction**

## Database Changes

Run the migration:
```sql
-- Run: backend/migrations/optimize_coaching_messages.sql
```

This adds:
- `context_summary` column to `coaching_sessions`
- `message_count` column to `coaching_sessions`
- Auto-cleanup trigger function
- Performance index

## Code Changes

Updated `coach.controller.ts`:
- Fetches context summary before building message context
- Inserts both user + AI messages in single operation
- Updates message count after each exchange
- Triggers summary generation every 20 messages
- Uses summary as system message for context

## Benefits

1. **Storage Efficient**: 50-80% reduction in storage usage
2. **Context Preserved**: AI still has conversation context via summaries
3. **Automatic**: Cleanup happens automatically via triggers
4. **Performance**: Fewer messages to query = faster responses
5. **Scalable**: Works for long-running sessions (100+ messages)

## Trade-offs

- Cannot retrieve full conversation history beyond 20 messages
- Summary quality depends on AI summarization
- Slightly more complex logic

## Configuration

Adjust these values in `coach.controller.ts` if needed:

```typescript
// Number of recent messages to keep
.limit(15)  // Line 116, 261

// Number of messages to store before cleanup
LIMIT 20    // In SQL trigger

// Summary update frequency
messageCount % 20 === 0  // Line 172, 317
```

## Future Enhancements

1. **Tiered Storage**: Keep more messages for premium users
2. **Export Feature**: Allow users to export full history before cleanup
3. **Selective Storage**: Only store important messages (marked by user/AI)
4. **Compression**: Compress older messages instead of deleting
