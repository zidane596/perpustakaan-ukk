import React from 'react'

export const Header = ({user, logout}) => {
  return (
    <div className="flex items-center justify-between rounded-lg mx-6 my-4 py-3 px-4 bg-white shadow-md">
      <div className="flex flex-col text-xl font-semibold text-gray-800">
        {user?.Username || 'Loading...'}
        <span className="text-gray-500 text-xs font-normal">{user?.Email || ''}</span>
      </div>
        <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">
          Logout
        </button>
    </div>
  )
}



