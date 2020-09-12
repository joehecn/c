
import db from '../../../src/main/db/index.js'

const t = async () => {
  const res = await db('set', {
    name: '123456',
    storeName: 'group',
    key: '123',
    value: group
  })
  console.log(res)
}

t().then(() => console.log('---- t end'))
