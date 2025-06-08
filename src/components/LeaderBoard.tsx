
import { getUserRanking } from '@/actions/getUserRanking-Problem-solved';
import { updateUserRating } from '@/actions/update-User-Rating';
import { prisma } from '@/lib';

async function LeaderBoard() {

  const users = await prisma.user.findMany();
  if (!users || users.length === 0) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <h1 className='text-2xl text-white'>No Users Found</h1>
      </div>
    )
  }
  return (
    <div >
      {
        users?.map((user: any) => {
          return (
            <div key={user?.id} className='grid grid-cols-6  text-center bg-gray-800 p-4 rounded-lg m-2 text-white'>
              <div>{user?.name}</div>
              <div>{user?.codeforcesProblemsSolved}</div>
              <div>{user?.leetcodeProblemsSolved}</div>
              <div>{user.leetcodeRating}</div>
              <div>{user.codeforcesRating}</div>
              <div>{user?.totalProblemsSolved}</div>
            </div>
          )
        })
      }
    </div>
  )
}

export default LeaderBoard
