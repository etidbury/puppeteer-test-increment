import { Browser, Page } from "puppeteer";
import { EventEmitter } from 'events'

export interface ScriptArgs {
    browser: Browser,
    page: Page
}