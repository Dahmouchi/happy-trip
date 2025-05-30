import  prisma  from '@/lib/prisma'
import PageControl from '../../_components/Landing'

export default async function LandingPageControl() {
  const landing = await prisma.landing.findFirst()

  return (
   <div>
    <PageControl initialData={landing}/>
   </div>
  )
}