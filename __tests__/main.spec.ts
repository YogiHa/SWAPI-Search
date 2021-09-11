import { search } from '../src'
import inquirer from 'inquirer'

describe('main', () => {
    let inquirerBackup: any
    beforeAll(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {})
        inquirerBackup = inquirer.prompt
    })

    afterEach(() => {
        inquirer.prompt = inquirerBackup
    })
    test('should return 411 for empty input', async () => {
        let result = await search()
        expect(result).toBe(411)
    })
    test('should get 404 for Jibrish input', async () => {
        let result = await search('asdasfdsffdvdfbfghadgr')
        expect(result).toBe(404)
    }, 10000)
    test('should get "A New Hope" result on partial string', async () => {
        //@ts-ignore
        inquirer.prompt = (_q) => Promise.resolve({ userCohice: 1 })
        let result = await search('ew hop')
        expect(result).toBe('A New Hope')
    }, 15000)
})
