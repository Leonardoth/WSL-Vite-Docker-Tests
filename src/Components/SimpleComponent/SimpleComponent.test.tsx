import { beforeEach, describe, expect, test } from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react'

import SimpleComponent from './SimpleComponent';


describe('Simple Component Tests', () => {
    
    
    test('Should show "this is a button" text', () => {
        render(<SimpleComponent/>)
        expect(screen.getByText(/this is a button/i)).toBeDefined()
    })

    test('Clicking the button should fire its onClick', () => {
        let eventFired = 0
        const clickEvent = () => eventFired += 1
        render(<SimpleComponent onClick={clickEvent}/>)
        const button = screen.getByText(/this is a button/i)
        fireEvent.click(button)
        expect(eventFired).toBe(1)
    })
})