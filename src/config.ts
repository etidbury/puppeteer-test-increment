export const SELECTOR_BTN_LOCAL_TEST_NUMBER_INCREMENT = '#btn-local-test-number-increment'
export const SELECTOR_BTN_SERVER_TEST_NUMBER_INCREMENT = '#btn-server-test-number-increment'
export const SELECTOR_CONTAINER_LOCAL_TEST_NUMBER = '#local-test-number'
export const SELECTOR_CONTAINER_SERVER_TEST_NUMBER = '#server-test-number'

if (typeof process.env.BASE_URL === "undefined") {
    throw new TypeError('Required environment variable BASE_URL not specified')
}

export const URL_HOMEPAGE = process.env.BASE_URL
