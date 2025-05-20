import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ReviewCard } from "./ReviewCard";

const reviews = [
  {
    name: "Olga",
    location: "Weave Studios – Kai Tak",
    rating: 5,
    title: "A real sense of community, nurtured",
    content:
      "Really appreciate the help and support from the staff during these tough times. Shoutout to Katie for...",
    image: "/images/product3.jpg",
  },
  {
    name: "Thomas",
    location: "Weave Studios – Olympic",
    rating: 5,
    title: "The facilities are superb. Clean, slick, bright.",
    content:
      "A real sense of community, nurtured. Really appreciate the help and support from the staff...",
    image: "/images/product2.jpg",
  },
  {
    name: "Eliot",
    location: "Weave Studios – Kai Tak",
    rating: 5,
    title: "A real sense of community, nurtured",
    content:
      "Really appreciate the help and support from the staff during these tough times. Shoutout to Katie for...",
    image: "/images/product.jpg",
  },
];

export default function ReviewsSection() {
  return (
    <section className="lg:py-16 py-6 bg-white text-center px-4">
      <h2 className="text-3xl font-bold mb-2">Reviews</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
        Que vous soyez en quête d&apos;évasion, d&apos;aventure ou de détente, nous concevons
        des escapades inoubliables, accessibles et pleines de charme, au cœur du Maroc authentique
      </p>
      <div className="relative container lg:px-28 py-8">
      <Carousel opts={{ align: "center" }} className="">
        <CarouselContent className="px-8">
        {reviews.map((review, index) => (
          <CarouselItem key={index} className="sm:basis-1/3 pb-2 lg:pt-4 py-4">
            <ReviewCard key={index} {...review} />
          </CarouselItem>
        ))}
        </CarouselContent>
        <div className="w-full flex justify-center items-center gap-4 mt-4 sm:justify-end sm:absolute sm:top-1/2 sm:left-auto sm:right-4 sm:translate-y-[-50%]">
            <CarouselPrevious className="static sm:absolute sm:left-0 sm:top-1/2 sm:-translate-y-1/2 w-8 h-8 bg-lime-900 text-white rounded-full hover:bg-lime-900 hover:cursor-pointer transition" />
            <CarouselNext className="static sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 w-8 h-8 bg-white text-slate-800 border border-slate-600 rounded-full hover:bg-lime-900 hover:text-white hover:cursor-pointer transition" />
        </div>
      </Carousel>
      </div>
    </section>
  );
}
