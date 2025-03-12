
import { getUserRanking } from '@/actions/getUserRanking-Problem-solved';

async function LeaderBoard() {

  const ranks = await getUserRanking();
  if(!ranks || ranks.length === 0) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <h1 className='text-2xl text-white'>No Users Found</h1>
      </div>
    )
  }
  return (
    <div >
      {
        ranks?.map((user: any) => {
          return (
            <div key={user?.id} className='grid grid-cols-4  text-center bg-gray-800 p-4 rounded-lg m-2 text-white'>
              <div>{user?.name}</div>
              <div>{user?.codeforcesProblemSolved}</div>
              <div>{user?.leetcodeProblemSolved}</div>
              <div>{user?.solvedProblems}</div>
            </div>
          )
        })
      }
    </div>
  )
}

export default LeaderBoard
