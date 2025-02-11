import consola from 'consola'
import { join } from 'node:path'
import { exit, cwd } from 'node:process'
import { generator } from '../generator'
import { checkCookbookOptions } from '../utils/cookbook-dto-checks'

export async function buildCommand() {
    const startTime = new Date()
    const [error, options] = await checkCookbookOptions(Bun.file(join(cwd(), 'cookbook.toml')))
    if (error) {
      consola.error(error.message)
      exit(0)
    }

    await generator.significant(options)
    await generator.insignificant(options)

    // await new Promise((resolve, reject) => {
    //   Bun.spawn(options.commands.build, {
    //     cwd: cwd(),
    //     stdin: "inherit",
    //     stdout: "inherit",
    //     onExit: (proc, code, signalCode, error) => {
    //       if (code !== 0) reject({ proc, code, signalCode, error });
    //       else resolve({ proc, code, signalCode, error });
    //     },
    //   });
    // });

    const endTime = new Date()

    console.log('')
    console.log(`△ Milkio build completed!`)
    console.log(`△ Time taken: ${endTime.getTime() - startTime.getTime()}ms`)
    console.log('')
}