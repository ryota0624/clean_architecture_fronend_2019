export class CreatePeriod {
    constructor(
        private name: Name,
        private periodicTime: PeriodicTime
    ) {}
}
export class Period {
    constructor(
        public id: ID,
        public name: Name,
        public periodicTime: PeriodicTime
    ) {}
}
export interface PeriodRepository {
    findById(id: ID): Promise<Period | null>
    findAll(): Promise<Period[]>
}

export class ID {
    private constructor(
        private str: string
    ) {}

    static of(str: string): ID {
        return new ID(str)
    }
}
export class Name {
    private constructor(
        private str: string
    ) {}

    static of(str: string): [string] | Name {
        if (str.length < 100) {
            return new Name(str)
        }

        return ["文字数上限超えているよ"]
    }
}
export class PeriodicTime {
    private constructor(
        private start: Date,
        private end: Date
    ) {}

    static of(start: Date, end: Date): [string] | PeriodicTime {
        if (start < end) {
            return ["開始時間が終了時間より後だよ"]
        }
        return new PeriodicTime(start, end)
    }
}

export class PeriodSpecification {
    forUpdate(period: Period): [string] {
        return [""]
    }

    forCreate(createPeriod: CreatePeriod): [string] {
        return [""]
    }
}

export abstract class PreiodService {
    constructor(private specification: PeriodSpecification) {}
    async create(nameStr: string, start: Date, end: Date): Promise<void> {
        const name = Name.of(nameStr)
        const time = PeriodicTime.of(start, end)

        if (name instanceof Name && time instanceof PeriodicTime) {
            const result = this.specification.forCreate(new CreatePeriod(
                name, time
            ))
            if (result.length > 1) {
                return Promise.reject(result)
            }
            return this.register(name, time)
        } else {
            return Promise.reject([name, time])
        }
    }

    async update(period: Period): Promise<void> {
        return this.store(period)
    }

    protected abstract store(period: Period): Promise<void>
    protected abstract register(name: Name, time: PeriodicTime): Promise<void> 
}