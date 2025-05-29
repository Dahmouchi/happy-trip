import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ReviewCardProps {
  name: string;
  location: string;
  rating: number;
  title: string;
  content: string;
  image: string;
}

export function ReviewCard({
  name,
  location,
  rating,
  title,
  content,
  image,
}: ReviewCardProps) {
  return (
    <Card className="rounded-xl lg:shadow-[19px_18px_4px_1px_rgba(34,_197,_94,_0.5)] shadow-[8px_8px_4px_1px_rgba(34,_197,_94,_0.5)] relative overflow-hidden ">
      <div className="absolute w-full h-full bg-green-100 left-3 top-3 -z-10 rounded-2xl"></div>
      <CardContent className="p-6 space-y-4">
        <h3 className="text-xl font-semibold">“{title}”</h3>
        <p className="text-sm text-muted-foreground">
          {content}
          <span className="ml-1 text-blue-600 cursor-pointer">View more</span>
        </p>

        <div className="flex items-center gap-1 text-yellow-400">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} size={16} fill="currentColor" />
          ))}
        </div>

        <div className="text-sm">
          <p className="font-medium">{name}</p>
          <p className="text-muted-foreground">{location}</p>
          <p className="text-blue-600 text-sm mt-1">Google</p>          
        </div>

        <div className="pt-2 w-ful rounded-xl bg-center bg-cover h-[30vh]" style={{backgroundImage:`url(${image})`}}>
           
        </div>
      </CardContent>
    </Card>
  );
}
