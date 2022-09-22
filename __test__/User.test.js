import "@testing-library/jest-dom"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import User from '../pages/user/[search]'
import singletonRouter, { useRouter } from 'next/router';
import NextLink from 'next/link';
import mockRouter from "next-router-mock";
import { createDynamicRouteParser } from "next-router-mock/dynamic-routes";

jest.mock('next/router', () => require('next-router-mock'));
// This is needed for mocking 'next/link':
jest.mock('next/dist/client/router', () => require('next-router-mock'));
mockRouter.useParser(createDynamicRouteParser([
    "/user/[search]",
    "/subreddit/[search]"
]));




describe("User", () => {

    const sampleFrequency = [{ "word": "what", "value": 5, "percent": 1 }, { "word": "it’s", "value": 5, "percent": 1 }, { "word": "need", "value": 4, "percent": 1 }, { "word": "i’m", "value": 4, "percent": 1 }, { "word": "sure", "value": 4, "percent": 1 }, { "word": "price", "value": 4, "percent": 1 }, { "word": "cpu", "value": 4, "percent": 1 }, { "word": "should", "value": 3, "percent": 1 }, { "word": "fellow", "value": 3, "percent": 1 }, { "word": "nice", "value": 3, "percent": 1 }]
    // it('should render a successful user', async () => {
    //     mockRouter.push('/user/peanu');
    //     expect(mockRouter).toMatchObject({
    //         pathname: '/user/[search]',
    //         query: { search: 'peanu' }
    //     });
    //     render(<User />)

    //     await waitFor(() => {
    //         expect(screen.getByTestId("mainSection"))
    //         expect(screen.getByTestId("user-overview"))
    //         expect(screen.getByTestId("user-analysis"))
    //     })
    // });

    // it('should render different chart when toggling cumulative', async () => {
    //     mockRouter.push('/user/peanu');
    //     expect(mockRouter).toMatchObject({
    //         pathname: '/user/[search]',
    //         query: { search: 'peanu' }
    //     });
    //     render(<User />)

    //     // await waitFor(() => {
    //     //     const cumulativeToggle = screen.getByTestId(`activity-comments-toggle-btn`)
    //     //     fireEvent.click(cumulativeToggle)
    //     //     // setTimeout(() => {
    //     //     //     const chart = screen.getByTestId(`activity-comments-chart`)
    //     //     //     expect(chart).toHaveClass("cumulative")
    //     //     // }, [3000])
    //     // })

    //     setTimeout(() => {
    //         const cumulativeToggle = screen.getByTestId(`activity-comments-toggle-btn`)
    //         fireEvent.click(cumulativeToggle)
    //         setTimeout(() => {
    //             const chart = screen.getByTestId(`activity-comments-chart`)
    //             expect(chart).toHaveClass("cumulative")
    //         }, [3000])
    //     }, [5000])

    // });


    // it('should render an unsuccessful user', async () => {
    //     mockRouter.push('/user/thisisnotavalidusernamewhatsoever');
    //     expect(mockRouter).toMatchObject({
    //         pathname: '/user/[search]',
    //         query: { search: 'thisisnotavalidusernamewhatsoever' }
    //     });
    //     render(<User />)

    //     await waitFor(() => {
    //         expect(screen.getByTestId("mainSection"))
    //         expect(screen.getByRole("heading", { name: /Dust/i }))
    //         // expect(screen.findByTestId("user-overview"))
    //         // expect(screen.findByTestId("user-analysis"))
    //     })
    // });


})