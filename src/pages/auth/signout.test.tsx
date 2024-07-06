import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signOut } from 'next-auth/react'
import SignOutPage from './signout'

jest.mock('next-auth/react', () => ({
  signOut: jest.fn()
}))

describe('SignOutPage', () => {
  it('calls signOut when Sign Out button is clicked', async () => {
    render(<SignOutPage />)

    const signOutButton = screen.getByRole('button', { name: 'Sign Out' })
    userEvent.click(signOutButton)

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled()
    })
  })

  it('navigates to /main when Cancel button is clicked', () => {
    render(<SignOutPage />)

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    userEvent.click(cancelButton)

    expect(window.location.pathname).toBe('/main')
  })
})