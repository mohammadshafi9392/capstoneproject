import React from 'react'

const Skill = (props) => {
  return (
    <div className={`w-max h-max inline-block rounded-lg m-2 py-1 px-2 ${props.have=='true'?' text-white bg-violet-500':'text-black border-black border-2'}`}>
        {props.skillName}
    </div>
  )
}

export default Skill