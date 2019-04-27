import {DashboardUseCase, UseCaseOutputDto} from '../usecases/DashboardUseCase'

import {PeriodDto} from './dtos/PeriodDto'
import {SheetDto} from './dtos/SheetDto'
import {SearchConidtion} from './dtos/SearchCondition'

function useCaseDto2PresenterDto(dto: UseCaseOutputDto): PresenterDto {
    throw new Error("")
}

export type PresenterDto = {
    periodRelSheets: SheetDto[]
    selectedPeriod: PeriodDto
    allPeriod: PeriodDto[]
}
type Callback = (dto: PresenterDto) => void

export class DashboardPresenter {
    private callbacks: Callback[] = []
    constructor(private usecase: DashboardUseCase) {
        this.usecase.onChange(dto => {
            this.callbacks.forEach(callback => {
                callback(useCaseDto2PresenterDto(dto))
            })
        })
    }
    searchSheets(periodIdStr?: string, condition?: SearchConidtion) {
        this.usecase.searchSheetsByPeriod(periodIdStr, condition)
    }

    onChange(callback: Callback) {
        this.callbacks.push(callback)
    }
}