import Visualizer from '@/app/components/Visualizer'
import { useRouter } from 'next/router'
 
export default function Page() {
  const router = useRouter()
  const queryParam = router.query.piece;
  /**
   * Query param is either string | string[] | undefined
   * Lets make sure it's not a string[]
   */
  let pieceKey = Array.isArray(queryParam) ? queryParam[0] : queryParam;
  return <Visualizer pieceKey={pieceKey} />
}