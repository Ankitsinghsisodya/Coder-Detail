
import { getUserRanking } from '@/actions/getUserRanking-Problem-solved'
import React from 'react'

async function LeaderBoard() {

const ranks =  await getUserRanking();
console.log('rankis',ranks);
  return (
    <div >
     {
    ranks?.map((user:any) => {

        console.log("user", user);
        return (
            <div key={user.id} className='grid grid-cols-4  text-center bg-gray-800 p-4 rounded-lg m-2 text-white'>
                <div>{user.name}</div>
                <div>{user.codeforcesProblemSolved}</div>
                <div>{user.leetcodeProblemSolved}</div>
                <div>{user.solvedProblems}</div>
            </div>
        )
    })
    }
    </div>
  )
}

export default LeaderBoard
