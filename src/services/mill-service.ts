import { io } from 'socket.io-client'
import { reactive } from 'vue'

export class HttpRequestError extends Error {
  constructor(
    msg: string,
    public statusCode: number,
  ) {
    super(msg)
    Object.setPrototypeOf(this, HttpRequestError.prototype)
  }
}

export interface AxisStatus {
  name: string
  encoderPos: number
  stepperPos: number
  stepperEncoderPos: number
  stepperLinearPos: number
}

export interface MillStatus {
  axes: AxisStatus[]
}

export class MillService {
  public status: MillStatus
  private host = 'http://mill-test.local:3000/'

  constructor(url: string) {
    console.log('MillService')
    this.status = reactive({
      axes: [
        {
          name: 'x',
          encoderPos: 0,
          stepperPos: 0,
          stepperEncoderPos: 0,
          stepperLinearPos: 0,
        },
        {
          name: 'y',
          encoderPos: 0,
          stepperPos: 0,
          stepperEncoderPos: 0,
          stepperLinearPos: 0,
        },
        {
          name: 'z',
          encoderPos: 0,
          stepperPos: 0,
          stepperEncoderPos: 0,
          stepperLinearPos: 0,
        },
      ],
    })

    const socket = io(url)

    socket.on('connect', () => {
      console.log('connect')
    })

    socket.on('disconnect', () => {
      console.log('disconnect')
    })

    socket.on('mill-status', (...args) => {
      const status = args[0]
      Object.assign(this.status, status)
    })
  }

  private async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.host}${path}`, {
      method: 'GET',
    })
    if (response.status !== 200) {
      throw new HttpRequestError(
        `Get of ${path} failed with status code ${response.status}`,
        response.status,
      )
    }
    return response.json()
  }

  private async post<T>(path: string, data: any): Promise<T> {
    const body = data
    const response = await fetch(`${this.host}${path}`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    if (response.status !== 200) {
      throw new HttpRequestError(
        `Post to ${path} failed with status code ${response.status}`,
        response.status,
      )
    }
    return response.json()
  }

  public async shutdown() {
    await this.get('shutdown')
  }
}
