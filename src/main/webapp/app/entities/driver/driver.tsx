import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { openFile, byteSize, Translate, translate, ICrudSearchAction, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './driver.reducer';
import { IDriver } from 'app/shared/model/driver.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IDriverProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IDriverState {
  search: string;
}

export class Driver extends React.Component<IDriverProps, IDriverState> {
  state: IDriverState = {
    search: ''
  };

  componentDidMount() {
    this.props.getEntities();
  }

  search = () => {
    if (this.state.search) {
      this.props.getSearchEntities(this.state.search);
    }
  };

  clear = () => {
    this.setState({ search: '' }, () => {
      this.props.getEntities();
    });
  };

  handleSearch = event => this.setState({ search: event.target.value });

  render() {
    const { driverList, match } = this.props;
    return (
      <div>
        <h2 id="driver-heading">
          <Translate contentKey="sistemaAmigoApp.driver.home.title">Drivers</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="sistemaAmigoApp.driver.home.createLabel">Create a new Driver</Translate>
          </Link>
        </h2>
        <Row>
          <Col sm="12">
            <AvForm onSubmit={this.search}>
              <AvGroup>
                <InputGroup>
                  <AvInput
                    type="text"
                    name="search"
                    value={this.state.search}
                    onChange={this.handleSearch}
                    placeholder={translate('sistemaAmigoApp.driver.home.search')}
                  />
                  <Button className="input-group-addon">
                    <FontAwesomeIcon icon="search" />
                  </Button>
                  <Button type="reset" className="input-group-addon" onClick={this.clear}>
                    <FontAwesomeIcon icon="trash" />
                  </Button>
                </InputGroup>
              </AvGroup>
            </AvForm>
          </Col>
        </Row>
        <div className="table-responsive">
          {driverList && driverList.length > 0 ? (
            <Table responsive aria-describedby="driver-heading">
              <thead>
                <tr>
                  <th>
                    <Translate contentKey="global.field.id">ID</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.driver.officialId">Official Id</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.driver.firstName">First Name</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.driver.lastName">Last Name</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.driver.picture">Picture</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.driver.user">User</Translate>
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {driverList.map((driver, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${driver.id}`} color="link" size="sm">
                        {driver.id}
                      </Button>
                    </td>
                    <td>
                      {driver.officialId ? (
                        <div>
                          <a onClick={openFile(driver.officialIdContentType, driver.officialId)}>
                            <img src={`data:${driver.officialIdContentType};base64,${driver.officialId}`} style={{ maxHeight: '30px' }} />
                            &nbsp;
                          </a>
                          <span>
                            {driver.officialIdContentType}, {byteSize(driver.officialId)}
                          </span>
                        </div>
                      ) : null}
                    </td>
                    <td>{driver.firstName}</td>
                    <td>{driver.lastName}</td>
                    <td>
                      {driver.picture ? (
                        <div>
                          <a onClick={openFile(driver.pictureContentType, driver.picture)}>
                            <Translate contentKey="entity.action.open">Open</Translate>
                            &nbsp;
                          </a>
                          <span>
                            {driver.pictureContentType}, {byteSize(driver.picture)}
                          </span>
                        </div>
                      ) : null}
                    </td>
                    <td>{driver.user ? driver.user.email : ''}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${driver.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${driver.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${driver.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.delete">Delete</Translate>
                          </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="alert alert-warning">
              <Translate contentKey="sistemaAmigoApp.driver.home.notFound">No Drivers found</Translate>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ driver }: IRootState) => ({
  driverList: driver.entities
});

const mapDispatchToProps = {
  getSearchEntities,
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Driver);
