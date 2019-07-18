import React from 'react'

import { render, fireEvent, waitForElement } from '@testing-library/react'

import Page from '../cmp-page'

describe('Testing the page', () => {
  it('Renders loader on page', () => {
    const props = {
      getPokemons: () => Promise.resolve({}),
      isFetched: true,
      collection: {}
    }

    const { getByText } = render(<Page {...props} />)
    expect(getByText('Loading...'))
  })

  it('Has a search that works', async () => {
    const props = {
      collection: {
        1: { id: '1', name: 'bulbasaur' },
        2: { id: '2', name: 'ivysaur' },
        3: { id: '3', name: 'venusaur' },
        4: { id: '4', name: 'charmander' },
        5: { id: '5', name: 'charmeleon' },
        6: { id: '6', name: 'charizard' },
        7: { id: '7', name: 'squirtle' },
        8: { id: '8', name: 'wartortle' },
        9: { id: '9', name: 'blastoise' }
      },
      getPokemons: () => Promise.resolve({}),
      isFetched: false
    }

    const { getByText, getByPlaceholderText, queryByText } = render(
      <Page {...props} />
    )

    const searchBar = getByPlaceholderText('Enter pokemon name...')
    await waitForElement(() => [
      getByText('bulbasaur'),
      getByText('charmander'),
      getByText('squirtle')
    ])
    fireEvent.change(searchBar, { target: { value: 'saur' } })
    expect(queryByText('charmander')).toBeNull()
    expect(queryByText('squirtle')).toBeNull()
  })

  it('Has an error and no other stuff if an error exists', async () => {
    const props = {
      getPokemons: () =>
        Promise.resolve({
          error: true,
          payload: { message: 'Sorry, no pokemons' }
        }),
      collection: {},
      isFetched: false
    }

    const { getByText } = render(<Page {...props} />)
    await waitForElement(() => getByText('Sorry, no pokemons'))
  })

  it('Has a matching snapshot', () => {
    const props = {
      collection: {
        1: { id: '1', name: 'bulbasaur' }
      },
      getPokemons: () => Promise.resolve({}),
      isFetched: false
    }

    const { asFragment } = render(<Page {...props} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
