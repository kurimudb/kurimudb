import { defaultCommand } from './commands/default'
import { buildCommand } from './commands/build'
import { buildUpgrade } from './commands/upgrade'

export async function execute() {
  switch (process.argv[2]) {
    default: {
      await defaultCommand()
      break
    }

    case 'dev': {
      await defaultCommand()
      break
    }

    case 'build': {
      await buildCommand()
      break
    }

    case 'up': {
      await buildUpgrade()
      break
    }

    case 'update': {
      await buildUpgrade()
      break
    }

    case 'upgrade': {
      await buildUpgrade()
      break
    }
  }
}
