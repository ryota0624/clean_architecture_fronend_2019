import * as Period from './Period'

export class Name {
    constructor(private str: string) {}
}
export class ID {}

export interface Sheet {
        id: ID
        periodId: Period.ID
        name: Name
}

export class ObjectiveSheet implements Sheet {
    static as(sheet: Sheet): sheet is ObjectiveSheet {
        return sheet instanceof ObjectiveSheet
    }
    constructor(
        public id: ID,
        public periodId: Period.ID,
        public name: Name) {}
}

export class HearingSheet implements Sheet {
    static as(sheet: Sheet): sheet is HearingSheet {
        return sheet instanceof HearingSheet
    }
    constructor(
        public id: ID,
        public periodId: Period.ID,
        public name: Name) {}
}

export interface SheetRepository {
    findByID(id: ID): Promise<null | Sheet>
    findByPeriodId(periodId: Period.ID): Promise<Sheet[]>
}