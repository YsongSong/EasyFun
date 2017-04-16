import React, {Component} from 'react'
import ColumnHeader from '../ColumnHeader'
import MovieList from './MovieList'
import Loading from '../Loading'
import Pages from '../Pages'
import {fetch_movie} from '../../common/fetch'
import * as config from '../../config'

export default class MovieColumn extends Component {
  state = {
    isLoading: false,
    MoviesData: null,
    current: 1
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    fetch_movie({
      start: config.DEFAULT_START,
      count: this.props.count || 4,
      type: this.props.type
    }).then(data=> {
      this.resolve(data);
    }).catch(err=> {
      console.log('parsing failed', err);
    })
    console.log( this.props.count )
  }

  resolve = data => {
    if (data) {
      this.setState({
        MoviesData: data.subjects,
        isLoading: false
      })
    }
  }

  pageChange = page => {
    this.setState({
      current: page
    })
    fetch_movie({
      start: (page - 1) * config.DEFAULT_COUNT,
      count: this.props.count || 4,
      type: this.props.type
    }).then(data=> {
      this.resolve(data)
    }).catch(err=> {
      console.log('parsing failed', err);
    })
  }

  render() {
    const {title, id, type, total, noPage, noHead} = this.props;
    const {MoviesData, isLoading, current} = this.state;
    return (
      <div>
        {
          !noHead &&<ColumnHeader
            id={id}
            title={title}
            isMore={false}
          />
        }

        { isLoading ? <Loading />:
          <div>
            <MovieList
              type={type}
              MoviesData={MoviesData}
              current={current}
            />
            {
              !noPage&& <Pages
                total={total}
                onChange={this.pageChange}
                current={current}
              />
            }
          </div>
        }
      </div>
    )
  }
}