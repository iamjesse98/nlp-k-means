import React, { Component } from 'react'
import './App.css'

import { TextInput, Card, Button } from 'belle'

import * as nlp from 'nlp_compromise'

function count(word, sentence) {
  let count = 0
  nlp.sentence(sentence).terms.forEach(w => {
    if(word === w.text) {
      count += 1
    }
  })
  return count
}

class App extends Component {

  constructor(props){
  	super(props)
  	this.state = {
      sentences: [],
      heads: []
    }
    this.appendSenetence = this.appendSenetence.bind(this)
    this.classify = this.classify.bind(this)
  }

  appendSenetence(event) {
    event.preventDefault()
    //console.log(nlp.sentence(document.getElementById('sentence').value))
    if(document.getElementById('sentence').value) this.setState({ sentences: [ ...this.state.sentences, document.getElementById('sentence').value.toLowerCase().replace(/,/g, ' ') ] })
    document.getElementById('sentence').value = ''
  }

  classify() {

    let terms = []

    this.state.sentences.forEach( sentence => {
      nlp.sentence(sentence).terms.forEach(e => {
        if(e.pos.Noun) {
          if(e.firstName || e.Place || e.Date || e.reasoning[0] === 'fallback') {
            e.text.split(/\s+/).forEach(d => terms.push(d))
          }
        }
        if(e.pos.Adjective){
          e.text.split(/\s+/).forEach(d => terms.push(d))
        }
      })
    })

    let unique = new Set(terms)
    let unique_terms = []

    for(let t of unique) {
      unique_terms.push(t)
    }

    this.setState({ heads: unique_terms })

  }

  render() {
    return (
      <div>
        <Card>
          <form onSubmit={this.appendSenetence}>
            <TextInput id="sentence" className="sentence" allowNewLine/>
            <br />
            <Button type="submit" style={{ borderRadius: '50%', float: 'right' }} primary>+</Button>
            <br />
          </form>
          <ul>
            { this.state.sentences.map( ( sentence, index ) => <li key={index}>{sentence}</li> ) }
          </ul>
        </Card>
          <Button onClick={ this.classify } style={{ margin: '0 auto', display: 'block' }}>Classify</Button>

          <Card>
            <h1>Words</h1>
            <table>
              <tbody>
                  <tr>
                    <th>sentence</th>
                    { this.state.heads.map( (title, index) => <th key={index}>{title}</th> ) }
                  </tr>
                  {
                    this.state.sentences.map( sentence => {
                      return (
                        <tr key={sentence}>
                        <td>{sentence}</td>
                        { this.state.heads.map( (title, index) => <td key={index}>{count(title, sentence)}</td> ) }
                        </tr>
                      )
                    } )
                  }
              </tbody>
            </table>
            <h1>Frequency</h1>
          </Card>
      </div>
    )
  }
}

export default App
