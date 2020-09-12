
// jest.mock('localforage')

import db from '../../../src/main/db/index.js'

describe.skip('main/db', () => {
  test.skip('unMock', async () => {
    await db('set', {
      name: '123456',
      storeName: 'group',
      key: '123',
      value: '456'
    })

    const _list1 = await db('list', {
      name: '123456',
      storeName: 'group'
    })
    console.log({ _list1 })

    const _get = await db('get', {
      name: '123456',
      storeName: 'group',
      key: '123'
    })
    console.log({ _get })

    await db('remove', {
      name: '123456',
      storeName: 'group',
      key: '123'
    })

    const _list2 = await db('list', {
      name: '123456',
      storeName: 'group'
    })
    console.log({ _list2 })

    expect(1).toEqual(1)
  })

  test.only('get', async () => {
    expect.assertions(1)
    const res = await db('get', {
      name: 'c',
      storeName: 'user',
      key: 'admin'
    })
    console.log({ res })
    expect(1).toBe(1)
  })

  test('mock', async () => {
    expect.assertions(3)

    const group = {
      groupName: 'test1',
      tos: {
        'm544w4': {
          NickName: 'joe',
          RemarkName: 'joehe'
        }
      }
    }
    await db('set', {
      name: '123456',
      storeName: 'group',
      key: '123',
      value: group
    })

    const list1 = await db('list', {
      name: '123456',
      storeName: 'group'
    })
    expect(list1).toEqual([{
      key: '123',
      value: group
    }])

    const res = await db('get', {
      name: '123456',
      storeName: 'group',
      key: '123'
    })
    expect(res).toEqual(group)

    await db('remove', {
      name: '123456',
      storeName: 'group',
      key: '123'
    })
    const list2 = await db('list', {
      name: '123456',
      storeName: 'group'
    })
    expect(list2.length).toBe(0)
  })

  test('msg', async () => {
    expect.assertions(3)

    await db('set', {
      name: '123456',
      storeName: 'msg',
      key: '123',
      value: 'message'
    })

    const msg = await db('get', {
      name: '123456',
      storeName: 'msg',
      key: '123'
    })

    expect(msg).toBe('message')

    db('set', {
      name: '123456',
      storeName: 'msg',
      key: '123',
      value: 'errorMsg'
    }).catch(err => {
      expect(err.status).toBe(1000)
      expect(err.message).toBe('数据库错误')
    })
  })
})
