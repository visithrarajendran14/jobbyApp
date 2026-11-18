import {Link} from 'react-router-dom'

const JobCard = props => {
  const {jobDetails} = props
  const {
    id,
    title,
    rating,
    companyLogoUrl,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="job-item">
        <div className="logo-title-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1>{title}</h1>
            <p>{rating}</p>
          </div>
        </div>
        <div>
          <p>{location}</p>
          <p>{employmentType}</p>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCard
