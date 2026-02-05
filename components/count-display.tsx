import { Badge } from "@/components/ui/badge";
import { Redis } from "@upstash/redis";
import { cn } from "@/lib/utils";
import { connection } from "next/server";

const redis = Redis.fromEnv();

export default async function CountDisplay({ componentName, className }: { componentName: string, className?: string }) {
    // Force dynamic rendering on each request instead of build time
    await connection();

    let totalViews = 0;
    try {
        totalViews = (await redis.get<number>(`registry:views:${componentName}`)) ?? 0;
    } catch (error) {
        console.error("Failed to fetch view count:", error);
    }

    return (
        <Badge variant="default" className={cn("w-fit h-fit", className)}>{totalViews} Downloads</Badge>
    )
}