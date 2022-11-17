import { isEmpty, trim, isArray, isNumber, isBoolean, isUndefined, isNull, isString } from 'lodash'
import { ErrorsMessagesType, AvailableResolutions } from '../types'

export const errorsValidator = {
  titleError: {
    message: "title is incorrectly",
    field: "title"
  },

  authorError: {
    message: "author is incorrectly",
    field: "author"
  },

  availableResolutionsError: {
    message: "availableResolutions is incorrectly",
    field: "availableResolutions"
  }, 

  canBeDownloadedError: {
    message: "canBeDownloaded is incorrectly",
    field: "canBeDownloaded"
  }, 
  
  minAgeRestrictionError: {
    message: "minAgeRestriction is incorrectly",
    field: "minAgeRestriction"
  },
  
  publicationDateError: {
    message: "publicationDate is incorrectly",
    field: "publicationDate"
  }, 
}

export const getErrors = (reqBody: any) => {
    const errorsMessages: ErrorsMessagesType[] = []

    if (isNull(reqBody.title) || isEmpty(trim(String(reqBody.title))) || trim(String(reqBody.title)).length > 40) {
      errorsMessages.push(errorsValidator.titleError)
    }

    if (isNull(reqBody.author) || isEmpty(trim(String(reqBody.author))) || trim(String(reqBody.author)).length > 20) {
      errorsMessages.push(errorsValidator.authorError)
    }

    if (isArray(reqBody.availableResolutions) && (
      isEmpty(reqBody.availableResolutions) || reqBody.availableResolutions.filter((item:AvailableResolutions) => Object.values(AvailableResolutions).includes(item)).length !== reqBody.availableResolutions.length
    )) {
      errorsMessages.push(errorsValidator.availableResolutionsError)
    }

    if (!isUndefined(reqBody.canBeDownloaded) && !isBoolean(reqBody.canBeDownloaded)) {
      errorsMessages.push(errorsValidator.canBeDownloadedError)
    }

    if (isNumber(reqBody.minAgeRestriction) && (reqBody.minAgeRestriction < 1 || reqBody.minAgeRestriction > 18)) {
      errorsMessages.push(errorsValidator.minAgeRestrictionError)
    }

    if (reqBody.publicationDate && !isString(reqBody.publicationDate)) {
      errorsMessages.push(errorsValidator.publicationDateError)
    }

    return { errorsMessages: errorsMessages }
  }
