'use client'
import { getUser } from '@/actions/get-User';
import { updateUserRating } from '@/actions/update-User-Rating';
import { useEffect, useState } from 'react';

// Remove async from component definition
function LeaderBoard({ state }: { state: string }) {
  // Use state to store users data
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Update ratings first
        await updateUserRating();
        // Then fetch users
        const fetchedUsers = await getUser();
        
        if (fetchedUsers && fetchedUsers.length > 0) {
          // Sort users based on the state parameter
          const sortedUsers = [...fetchedUsers].sort((a, b) => {
            switch (state) {
              case 'totalProblemsSolved':
                return (b.totalProblemsSolved || 0) - (a.totalProblemsSolved || 0);
              case 'codeforcesProblemsSolved':
                return (b.codeforcesProblemsSolved || 0) - (a.codeforcesProblemsSolved || 0);
              case 'leetcodeProblemsSolved':
                return (b.leetcodeProblemsSolved || 0) - (a.leetcodeProblemsSolved || 0);
              case 'codeforcesRating':
                return (b.codeforcesRating || 0) - (a.codeforcesRating || 0);
              case 'leetcodeRating':
                return (b.leetcodeRating || 0) - (a.leetcodeRating || 0);
              default:
                return (b.totalProblemsSolved || 0) - (a.totalProblemsSolved || 0);
            }
          });
          
          // Update state with sorted users
          setUsers(sortedUsers);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [state]); // Re-run when state parameter changes
  
  // Show loading state
  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <h1 className='text-2xl text-white'>Loading...</h1>
      </div>
    );
  }
  
  // Show message if no users found
  if (!users || users.length === 0) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <h1 className='text-2xl text-white'>No Users Found</h1>
      </div>
    );
  }
  
  // Render users list

  return (
    <div>
      {users.map((user: any) => (
        <div key={user?.id} className='grid grid-cols-6 text-center bg-gray-800 p-4 rounded-lg m-2 text-white'>
          <div>{user?.name}</div>
          <div>{user?.codeforcesProblemsSolved || 0}</div>
          <div>{user?.leetcodeProblemsSolved || 0}</div>
          <div>{user?.leetcodeRating || 0}</div>
          <div>{user?.codeforcesRating || 0}</div>
          <div>{user?.totalProblemsSolved || 0}</div>
        </div>
      ))}
    </div>
  );
}

export default LeaderBoard;