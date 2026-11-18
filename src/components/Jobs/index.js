import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobCard from '../JobCard'
import Profile from '../Profile'

const employmentList = [
  {label: 'Full Time', id: 'FULLTIME'},
  {label: 'Part Time', id: 'PARTTIME'},
  {label: 'Freelance', id: 'FREELANCE'},
  {label: 'Internship', id: 'INTERNSHIP'},
]
const salaryList = [
  {label: '10 LPA and above', id: '1000000'},
  {label: '20 LPA and above', id: '2000000'},
  {label: '30 LPA and above', id: '3000000'},
  {label: '40 LPA and above', id: '4000000'},
]

class Jobs extends Component {
  state = {jobs: [], employment: [], salary: '', search: '', status: 'INITIAL'}

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({status: 'LOADING'})
    const {employment, salary, search} = this.state
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employment.join(
      ',',
    )}&minimum_package=${salary}&search=${search}`
    const res = await fetch(url, {headers: {Authorization: `Bearer ${token}`}})
    if (res.ok) {
      const data = await res.json()
      this.setState({
        jobs: data.jobs.map(j => ({
          id: j.id,
          title: j.title,
          rating: j.rating,
          companyLogoUrl: j.company_logo_url,
          location: j.location,
          employmentType: j.employment_type,
          packagePerAnnum: j.package_per_annum,
          jobDescription: j.job_description,
        })),
        status: 'SUCCESS',
      })
    } else {
      this.setState({status: 'FAILURE'})
    }
  }

  onChangeEmployment = id => {
    this.setState(prev => {
      const {employment} = prev
      if (employment.includes(id)) {
        return {employment: employment.filter(each => each !== id)}
      }
      return {employment: [...employment, id]}
    }, this.getJobs)
  }

  onChangeSalary = id => {
    this.setState({salary: id}, this.getJobs)
  }

  onEnterSearch = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  render() {
    const {jobs, search, status} = this.state
    return (
      <>
        <Header />
        <div>
          <div>
            <Profile />
            <h1>Type of Employment</h1>
            {employmentList.map(e => (
              <div key={e.id}>
                <input
                  type="checkbox"
                  id={e.id}
                  onChange={() => this.onChangeEmployment(e.id)}
                />
                <label htmlFor={e.id}>{e.label}</label>
              </div>
            ))}
            <h1>Salary Range</h1>
            {salaryList.map(e => (
              <div key={e.id}>
                <input
                  type="radio"
                  id={e.id}
                  name="salary"
                  onChange={() => this.onChangeSalary(e.id)}
                />
                <label htmlFor={e.id}>{e.label}</label>
              </div>
            ))}
          </div>
          <div>
            <div>
              <input
                type="search"
                value={search}
                onChange={e => this.setState({search: e.target.value})}
                onKeyDown={this.onEnterSearch}
                placeholder="Search"
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.getJobs}
              >
                <BsSearch />
              </button>
            </div>
            {status === 'LOADING' && (
              <div className="loader-container" data-testid="loader">
                <Loader
                  type="ThreeDots"
                  color="#ffffff"
                  height="50"
                  width="50"
                />
              </div>
            )}
            {status === 'FAILURE' && (
              <div>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
                  alt="failure view"
                />
                <h1>Oops! Something Went Wrong</h1>
                <p>We cannot seem to find the page you are looking for</p>
                <button type="button" onClick={this.getJobs}>
                  Retry
                </button>
              </div>
            )}
            {status === 'SUCCESS' &&
              (jobs.length === 0 ? (
                <div>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                    alt="no jobs"
                  />
                  <h1>No Jobs Found</h1>
                  <p>We could not find any jobs. Try other filters</p>
                </div>
              ) : (
                <ul>
                  {jobs.map(j => (
                    <JobCard key={j.id} jobDetails={j} />
                  ))}
                </ul>
              ))}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
