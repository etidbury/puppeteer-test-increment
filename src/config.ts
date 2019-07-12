export const SELECTOR_BTN_LOCAL_TEST_NUMBER_INCREMENT = '#btn-local-test-number-increment'
export const SELECTOR_BTN_SERVER_TEST_NUMBER_INCREMENT = '#btn-server-test-number-increment'
export const SELECTOR_CONTAINER_LOCAL_TEST_NUMBER = '#local-test-number'
export const SELECTOR_CONTAINER_SERVER_TEST_NUMBER = '#server-test-number'

export const URL_HOMEPAGE = `http://${process.env.DOCKER_CONTAINER ? 'host.docker.internal' : 'localhost'}:3070/`
