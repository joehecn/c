
const myUrl = 'https://api.github.com/repos/joehecn/c/releases/latest'

const github = async () => {
  const res = await fetch(myUrl, {
    headers: {
      'User-Agent': 'joehecn'
    }
  })
  return res.json()
}

export default github
