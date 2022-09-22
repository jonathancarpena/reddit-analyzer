import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import Home from '../pages/index'
import mockRouter from 'next-router-mock';
import Form from '../components/Form'
import SearchInput from "../components/Form/SearchInput";
import DarkModeToggle from '../components/DarkModeToggle'

jest.mock('next/router', () => require('next-router-mock'));


describe("Home", () => {
    beforeEach(() => {
        mockRouter.setCurrentUrl("/initial");
    });

    describe("landing page render", () => {


        it("should renders header", async () => {
            render(<Home />)
            const headingElement = screen.getByTestId("reddit-analyzer-header")
            expect(headingElement).toBeInTheDocument()
        })

        it("should render form", () => {
            render(<Home />)
            const form = screen.getByRole("form")
            expect(form).toBeInTheDocument()
        })

        it("should render the dark mode toggle button", () => {
            render(<Home />)
            const button = screen.getByTestId("darkModeToggle")
            expect(button).toBeInTheDocument()
        })
    })

    describe("dark mode toggle", () => {
        it("should change icons after clicking", () => {
            render(<DarkModeToggle />)
            const button = screen.getByTestId("darkModeToggle")
            fireEvent.click(button)
            const spanElements = screen.getByTestId("moon-fill")
            expect(spanElements).toBeInTheDocument()
        })
        it("should change header bg and text color after clicking", async () => {
            render(<Home />)
            const button = screen.getByTestId("darkModeToggle")
            fireEvent.click(button)

            setTimeout(() => {
                const header = screen.getByTestId("header-bg")
                expect(header).toHaveClass("bg-gray-900 text-secondary-100")
            }, 200)

        })
    })

    describe("form functionality", () => {

        it("should render different placeholder based on type prop", () => {
            render(
                <SearchInput
                    type="user"
                    inputRef={null}
                    handleFormSubmit={() => jest.fn()} />
            )
            expect(screen.getByPlaceholderText(/Search Username/i))
            render(
                <SearchInput
                    type="subreddit"
                    inputRef={null}
                    handleFormSubmit={() => jest.fn()} />
            )
            expect(screen.getByPlaceholderText(/Search Subreddit/i))
        })

        it("should render both search user input and search subreddit input", () => {
            render(<Form />)

            const userInput = screen.getAllByPlaceholderText(/Search Username/i)
            const searchInput = screen.getAllByPlaceholderText(/Search Subreddit/i)

            expect(userInput.length).toBe(2)
            expect(searchInput.length).toBe(1)
        })

        it("should render input by the user ", () => {
            render(<Form />)
            const sampleText = "Hello World"
            const userInput = screen.getAllByPlaceholderText(/Search Username/i)[0]
            fireEvent.change(userInput, { target: { value: sampleText } })
            expect(userInput.value).toBe(sampleText)
        })

        it("should render the loading animation after clicking search", () => {
            render(<Home />)
            const userInput = screen.getAllByPlaceholderText(/Search Username/i)[0]
            const submitButton = screen.getAllByTestId("user-search-button")[0]

            fireEvent.change(userInput, { target: { value: "Hello World" } })
            fireEvent.click(submitButton)

            const loadingHeader = screen.getByRole("heading", { name: /Analyzing.../i })
            expect(loadingHeader).toBeInTheDocument()

        })






    })

})