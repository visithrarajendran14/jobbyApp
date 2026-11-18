import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import Header from '../Header'

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: 'INITIAL',
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: 'IN_PROGRESS'})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const jobDetails = data.job_details
      const updatedJobDetails = {
        id: jobDetails.id,
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        jobDescription: jobDetails.job_description,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        title: jobDetails.title,
        lifeAtCompany: {
          description: jobDetails.life_at_company.description,
          imageUrl: jobDetails.life_at_company.image_url,
        },
        skills: jobDetails.skills.map(eachSkill => ({
          name: eachSkill.name,
          imageUrl: eachSkill.image_url,
        })),
      }
      const updatedSimilarJobs = data.similar_jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs: updatedSimilarJobs,
        apiStatus: 'SUCCESS',
      })
    } else {
      this.setState({apiStatus: 'FAILURE'})
    }
  }

  renderFailureView = () => (
    <div className="job-details-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      lifeAtCompany,
      skills,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany

    return (
      <div className="job-details-container">
        <div className="job-card">
          <div className="logo-title-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div>
              <h1>{title}</h1>
              <p>
                <BsStarFill /> {rating}
              </p>
            </div>
          </div>
          <div>
            <p>
              <MdLocationOn /> {location}
            </p>
            <p>
              <BsBriefcaseFill /> {employmentType}
            </p>
            <p>{packagePerAnnum}</p>
          </div>
          <a href={companyWebsiteUrl}>Visit</a>
          <h1>Description</h1>
          <p>{jobDescription}</p>
          <h1>Skills</h1>
          <ul>
            {skills.map(eachSkill => (
              <li key={eachSkill.name}>
                <img src={eachSkill.imageUrl} alt={eachSkill.name} />
                <p>{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <h1>Life at Company</h1>
          <p>{description}</p>
          <img src={imageUrl} alt="life at company" />
        </div>
        <h1>Similar Jobs</h1>
        <ul>
          {similarJobs.map(eachJob => (
            <li key={eachJob.id}>
              <img
                src={eachJob.companyLogoUrl}
                alt="similar job company logo"
              />
              <h1>{eachJob.title}</h1>
              <p>{eachJob.rating}</p>
              <h1>Description</h1>
              <p>{eachJob.jobDescription}</p>
              <p>{eachJob.location}</p>
              <p>{eachJob.employmentType}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case 'SUCCESS':
        return (
          <>
            <Header />
            {this.renderSuccessView()}
          </>
        )
      case 'FAILURE':
        return (
          <>
            <Header />
            {this.renderFailureView()}
          </>
        )
      case 'IN_PROGRESS':
        return (
          <>
            <Header />
            {this.renderLoadingView()}
          </>
        )
      default:
        return null
    }
  }
}

export default JobItemDetails
