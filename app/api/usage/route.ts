import { NextResponse } from 'next/server';
import { client } from '@/lib/redis';
import { getUsageKey } from '@/utils/aiUsageManager';

const MAX_USES = 2;
const COOLDOWN_MINUTES = 1; 

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Key is required' }, { status: 400 });
  }

  try {
    const usageData = await client.get(getUsageKey(key)); 
    const now = Date.now();

    if (usageData) {
      const { count, timestamp }: { count: number; timestamp: number } = JSON.parse(usageData);

      if (count >= MAX_USES) {
        const cooldownRemaining = COOLDOWN_MINUTES * 1 * 60 * 1000 - (now - timestamp);  

        if (cooldownRemaining > 0) {
          return NextResponse.json({
            allowed: false,
            remainingUses: 0,
            cooldownRemaining,
          });
        } else {
          await client.set(
            getUsageKey(key),
            JSON.stringify({ count: MAX_USES, timestamp: now })
          );
          return NextResponse.json({
            allowed: true,
            remainingUses: MAX_USES,
          });
        }
      }

      return NextResponse.json({
        allowed: true,
        remainingUses: MAX_USES - count,
      });
    }

    await client.set(
      getUsageKey(key),
      JSON.stringify({ count: 1, timestamp: now })
    );
    return NextResponse.json({
      allowed: true,
      remainingUses: MAX_USES - 1,
    });
  } catch (error) {
    console.error('Error checking usage:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
