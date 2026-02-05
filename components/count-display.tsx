import { Badge } from "@/components/ui/badge";
import { Redis } from "@upstash/redis";
import { cn } from "@/lib/utils";

const redis = Redis.fromEnv();

export default async function CountDisplay({ componentName, className }: { componentName: string, className?: string }) {
    const totalViews: number = await redis.get(`registry:views:${componentName}`) ?? 0;

    return (
        <Badge variant="default" className={cn("w-fit h-fit", className)}>{totalViews} Downloads</Badge>
    )
}