
function home() {

    const userName = localStorage.getItem('user')
  return (
    <><h1>HEY! {userName}</h1></>
  )
}

export default home