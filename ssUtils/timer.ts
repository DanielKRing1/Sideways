export class TimerMan {
  static _instance: TimerMan | null = null;

  static timerMap: Record<string, Timer> = {};

  constructor() {
    if (TimerMan._instance) {
      return TimerMan._instance;
    }
    TimerMan._instance = this;
  }

  static getTimer(key: string) {
    if (TimerMan.timerMap[key] === undefined) {
      TimerMan.timerMap[key] = new Timer();
    }

    return TimerMan.timerMap[key];
  }
}

class Timer {
  start: Date;
  lastMark: Date;

  constructor() {
    this.start = new Date();
    this.lastMark = this.start;
  }

  total(): number {
    return (new Date().getTime() - this.start.getTime()) / 1000;
  }

  interval(): number {
    console.log(new Date());
    console.log(this.lastMark);
    console.log(new Date().getTime() - this.lastMark.getTime());
    console.log((new Date().getTime() - this.lastMark.getTime()) / 1000);
    const elapsedTime = (new Date().getTime() - this.lastMark.getTime()) / 1000;
    this.lastMark = new Date();

    return elapsedTime;
  }

  logTotal(prefix: string = ''): Timer {
    console.log(`${prefix}${this.total()}`);

    return this;
  }

  logInterval(prefix: string = ''): Timer {
    console.log(`${prefix}${this.interval()}`);

    return this;
  }

  restart(): Timer {
    this.start = new Date();
    this.lastMark = this.start;

    return this;
  }
}
