import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudSearchAction, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './warehouse.reducer';
import { IWarehouse } from 'app/shared/model/warehouse.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IWarehouseProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IWarehouseState {
  search: string;
}

export class Warehouse extends React.Component<IWarehouseProps, IWarehouseState> {
  state: IWarehouseState = {
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
    const { warehouseList, match } = this.props;
    return (
      <div>
        <h2 id="warehouse-heading">
          <Translate contentKey="sistemaAmigoApp.warehouse.home.title">Warehouses</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="sistemaAmigoApp.warehouse.home.createLabel">Create a new Warehouse</Translate>
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
                    placeholder={translate('sistemaAmigoApp.warehouse.home.search')}
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
          {warehouseList && warehouseList.length > 0 ? (
            <Table responsive aria-describedby="warehouse-heading">
              <thead>
                <tr>
                  <th>
                    <Translate contentKey="global.field.id">ID</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.warehouse.name">Name</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.warehouse.division">Division</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.warehouse.owner">Owner</Translate>
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {warehouseList.map((warehouse, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${warehouse.id}`} color="link" size="sm">
                        {warehouse.id}
                      </Button>
                    </td>
                    <td>{warehouse.name}</td>
                    <td>
                      <Translate contentKey={`sistemaAmigoApp.DivisionType.${warehouse.division}`} />
                    </td>
                    <td>{warehouse.owner ? <Link to={`company/${warehouse.owner.id}`}>{warehouse.owner.legalName}</Link> : ''}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${warehouse.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${warehouse.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${warehouse.id}/delete`} color="danger" size="sm">
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
              <Translate contentKey="sistemaAmigoApp.warehouse.home.notFound">No Warehouses found</Translate>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ warehouse }: IRootState) => ({
  warehouseList: warehouse.entities
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
)(Warehouse);
