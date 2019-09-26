import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudSearchAction, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './cargo.reducer';
import { ICargo } from 'app/shared/model/cargo.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ICargoProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface ICargoState {
  search: string;
}

export class Cargo extends React.Component<ICargoProps, ICargoState> {
  state: ICargoState = {
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
    const { cargoList, match } = this.props;
    return (
      <div>
        <h2 id="cargo-heading">
          <Translate contentKey="sistemaAmigoApp.cargo.home.title">Cargos</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="sistemaAmigoApp.cargo.home.createLabel">Create a new Cargo</Translate>
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
                    placeholder={translate('sistemaAmigoApp.cargo.home.search')}
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
          {cargoList && cargoList.length > 0 ? (
            <Table responsive aria-describedby="cargo-heading">
              <thead>
                <tr>
                  <th>
                    <Translate contentKey="global.field.id">ID</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.cargo.type">Type</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.cargo.uniqueId">Unique Id</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.cargo.description">Description</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.cargo.status">Status</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.cargo.warehouse">Warehouse</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.cargo.seals">Seals</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.cargo.client">Client</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.cargo.warehouses">Warehouses</Translate>
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {cargoList.map((cargo, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${cargo.id}`} color="link" size="sm">
                        {cargo.id}
                      </Button>
                    </td>
                    <td>
                      <Translate contentKey={`sistemaAmigoApp.CargoType.${cargo.type}`} />
                    </td>
                    <td>{cargo.uniqueId}</td>
                    <td>{cargo.description}</td>
                    <td>
                      <Translate contentKey={`sistemaAmigoApp.CargoStatusType.${cargo.status}`} />
                    </td>
                    <td>{cargo.warehouse ? <Link to={`warehouse/${cargo.warehouse.id}`}>{cargo.warehouse.name}</Link> : ''}</td>
                    <td>{cargo.seals ? <Link to={`seal/${cargo.seals.id}`}>{cargo.seals.uniqueId}</Link> : ''}</td>
                    <td>{cargo.client ? <Link to={`client/${cargo.client.id}`}>{cargo.client.uniqueId}</Link> : ''}</td>
                    <td>{cargo.warehouses ? <Link to={`warehouse/${cargo.warehouses.id}`}>{cargo.warehouses.name}</Link> : ''}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${cargo.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${cargo.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${cargo.id}/delete`} color="danger" size="sm">
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
              <Translate contentKey="sistemaAmigoApp.cargo.home.notFound">No Cargos found</Translate>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ cargo }: IRootState) => ({
  cargoList: cargo.entities
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
)(Cargo);
