import { Badge } from "@/components/ui/badge";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function CountDisplay({ componentName }: { componentName: string }) {
    const totalViews: number = await redis.get(`registry:views:${componentName}`) ?? 0;

    return (
        <Badge variant="default" className="w-fit h-fit">{totalViews} Downloads</Badge>
    )
}