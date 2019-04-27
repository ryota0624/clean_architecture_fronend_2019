import * as Sheet from '../entities/Sheet'
import * as Period from '../entities/Period'

export type SearchCondition = {
    name: string
}

function fileterBySearchCondition(sheets: Sheet.Sheet[], condition: SearchCondition): Sheet.Sheet[] {
    return []
}

export type UseCaseInputDto = {
    searchCondition?: SearchCondition
    periodId: string
}
export type UseCaseOutputDto = {
    selectedPeriodRelSheets: Sheet.Sheet[]
    allPeriods: Period.Period[]
    selectedPeriodId: Period.ID
}

export type OutputPort<Dto> = (dto: Dto) => void

abstract class UseCase<OutputDto> {
    protected outputPorts: OutputPort<OutputDto>[] = []
    onChange(callback: OutputPort<OutputDto>) {
        this.outputPorts.push(callback)
    }
}

export interface DashboardUseCase extends UseCase<UseCaseOutputDto> {
    searchSheetsByPeriod(periodId?: string, condition?: SearchCondition)
}

export class DashboardUseCaseInteractor extends UseCase<UseCaseOutputDto> implements DashboardUseCase {
    constructor(
        private periodRepo: Period.PeriodRepository,
        private sheetRepo: Sheet.SheetRepository
    ) {
        super()
    }

    async searchSheetsByPeriod(periodIdStr?: string, condition?: SearchCondition) {
        const allPeriods = await this.periodRepo.findAll();
        const periodId = periodIdStr ? Period.ID.of(periodIdStr) : allPeriods[0].id
                
        const sheets = await this.sheetRepo.findByPeriodId(periodId)

        this.outputPorts.forEach(port => {
            port({
                selectedPeriodId: periodId,
                allPeriods: allPeriods,
                selectedPeriodRelSheets: fileterBySearchCondition(sheets, condition) 
            })
        })
    }
}