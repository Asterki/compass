import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpPage, { getServerSideProps } from './access';

jest.mock('next-auth/react', () => ({
  getProviders: jest.fn(),
  signIn: jest.fn(),
}));

describe('SignUpPage', () => {
  it('renders the page correctly', () => {
    const providers = {
      Google: { id: 'google', name: 'Google' },
      GitHub: { id: 'github', name: 'GitHub' },
      Discord: { id: 'discord', name: 'Discord' },
    };
    render(<SignUpPage providers={providers} />);
    
    expect(screen.getByText('Register to ClassCompass')).toBeInTheDocument();
    expect(screen.getByText('Select a provider')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Google' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'GitHub' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Discord' })).toBeInTheDocument();
  });

  it('calls signIn when a provider button is clicked', () => {
    const providers = {
      Google: { id: 'google', name: 'Google' },
      GitHub: { id: 'github', name: 'GitHub' },
      Discord: { id: 'discord', name: 'Discord' },
    };
    render(<SignUpPage providers={providers} />);
    
    userEvent.click(screen.getByRole('button', { name: 'Google' }));
    expect(signIn).toHaveBeenCalledWith('google');

    userEvent.click(screen.getByRole('button', { name: 'GitHub' }));
    expect(signIn).toHaveBeenCalledWith('github');

    userEvent.click(screen.getByRole('button', { name: 'Discord' }));
    expect(signIn).toHaveBeenCalledWith('discord');
  });

  it('redirects to "/" if user is already signed in', async () => {
    const context = {
      req: {},
      res: {},
    };
    const session = { user: { name: 'John Doe' } };
    const authOptions = {};
    const redirectMock = jest.fn();
    const getServerSessionMock = jest.spyOn(require('next-auth/next'), 'getServerSession').mockImplementation(() => session);
    const getProvidersMock = jest.spyOn(require('next-auth/react'), 'getProviders').mockImplementation(() => ({}));

    await getServerSideProps(context as any);

    expect(getServerSessionMock).toHaveBeenCalledWith(context.req, context.res, authOptions);
    expect(getProvidersMock).not.toHaveBeenCalled();
    expect(redirectMock).toHaveBeenCalledWith({ destination: '/' });

    getServerSessionMock.mockRestore();
    getProvidersMock.mockRestore();
  });

  it('fetches providers and returns them as props', async () => {
    const context = {
      req: {},
      res: {},
    };
    const session = null;
    const authOptions = {};
    const providers = {
      Google: { id: 'google', name: 'Google' },
      GitHub: { id: 'github', name: 'GitHub' },
      Discord: { id: 'discord', name: 'Discord' },
    };
    const getServerSessionMock = jest.spyOn(require('next-auth/next'), 'getServerSession').mockImplementation(() => session);
    const getProvidersMock = jest.spyOn(require('next-auth/react'), 'getProviders').mockImplementation(() => providers);

    const props = await getServerSideProps(context as any);

    expect(getServerSessionMock).toHaveBeenCalledWith(context.req, context.res, authOptions);
    expect(getProvidersMock).toHaveBeenCalled();
    expect(props).toEqual({ props: { providers } });

    getServerSessionMock.mockRestore();
    getProvidersMock.mockRestore();
  });
});