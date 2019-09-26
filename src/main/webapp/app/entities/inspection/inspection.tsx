import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { openFile, byteSize, Translate, translate, ICrudSearchAction, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './inspection.reducer';
import { IInspection } from 'app/shared/model/inspection.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IInspectionProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IInspectionState {
  search: string;
}

export class Inspection extends React.Component<IInspectionProps, IInspectionState> {
  state: IInspectionState = {
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
    const { inspectionList, match } = this.props;
    return (
      <div>
        <h2 id="inspection-heading">
          <Translate contentKey="sistemaAmigoApp.inspection.home.title">Inspections</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="sistemaAmigoApp.inspection.home.createLabel">Create a new Inspection</Translate>
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
                    placeholder={translate('sistemaAmigoApp.inspection.home.search')}
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
          {inspectionList && inspectionList.length > 0 ? (
            <Table responsive aria-describedby="inspection-heading">
              <thead>
                <tr>
                  <th>
                    <Translate contentKey="global.field.id">ID</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.inspection.date">Date</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.inspection.signature">Signature</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.inspection.location">Location</Translate>
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {inspectionList.map((inspection, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${inspection.id}`} color="link" size="sm">
                        {inspection.id}
                      </Button>
                    </td>
                    <td>
                      <TextFormat type="date" value={inspection.date} format={APP_DATE_FORMAT} />
                    </td>
                    <td>
                      {inspection.signature ? (
                        <div>
                          <a onClick={openFile(inspection.signatureContentType, inspection.signature)}>
                            <img
                              src={`data:${inspection.signatureContentType};base64,${inspection.signature}`}
                              style={{ maxHeight: '30px' }}
                            />
                            &nbsp;
                          </a>
                          <span>
                            {inspection.signatureContentType}, {byteSize(inspection.signature)}
                          </span>
                        </div>
                      ) : null}
                    </td>
                    <td>
                      {inspection.location ? <Link to={`location/${inspection.location.id}`}>{inspection.location.address}</Link> : ''}
                    </td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${inspection.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${inspection.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${inspection.id}/delete`} color="danger" size="sm">
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
              <Translate contentKey="sistemaAmigoApp.inspection.home.notFound">No Inspections found</Translate>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ inspection }: IRootState) => ({
  inspectionList: inspection.entities
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
)(Inspection);
