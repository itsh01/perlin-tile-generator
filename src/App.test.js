import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import App from './App'

beforeEach(() => {
    const createElement = document.createElement.bind(document)
    document.createElement = tagName => tagName === 'canvas' ? {
        getContext: () => ({fillRect: _.noop}),
        toDataURL: _.noop
    } : createElement(tagName)
})

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<App />, div)
    ReactDOM.unmountComponentAtNode(div)
})
