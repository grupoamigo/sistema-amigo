import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ICompany } from 'app/shared/model/company.model';
import { getEntities as getCompanies } from 'app/entities/company/company.reducer';
import { getEntity, updateEntity, createEntity, reset } from './transport.reducer';
import { ITransport } from 'app/shared/model/transport.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITransportUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface ITransportUpdateState {
  isNew: boolean;
  ownerId: string;
}

export class TransportUpdate extends React.Component<ITransportUpdateProps, ITransportUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      ownerId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getCompanies();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { transportEntity } = this.props;
      const entity = {
        ...transportEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/transport');
  };

  render() {
    const { transportEntity, companies, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="sistemaAmigoApp.transport.home.createOrEditLabel">
              <Translate contentKey="sistemaAmigoApp.transport.home.createOrEditLabel">Create or edit a Transport</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : transportEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="transport-id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="transport-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="plateIdLabel" for="transport-plateId">
                    <Translate contentKey="sistemaAmigoApp.transport.plateId">Plate Id</Translate>
                  </Label>
                  <AvField
                    id="transport-plateId"
                    type="text"
                    name="plateId"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="typeLabel" for="transport-type">
                    <Translate contentKey="sistemaAmigoApp.transport.type">Type</Translate>
                  </Label>
                  <AvInput
                    id="transport-type"
                    type="select"
                    className="form-control"
                    name="type"
                    value={(!isNew && transportEntity.type) || 'CAMION'}
                  >
                    <option value="CAMION">{translate('sistemaAmigoApp.TransportType.CAMION')}</option>
                    <option value="FFCC">{translate('sistemaAmigoApp.TransportType.FFCC')}</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="transport-owner">
                    <Translate contentKey="sistemaAmigoApp.transport.owner">Owner</Translate>
                  </Label>
                  <AvInput id="transport-owner" type="select" className="form-control" name="owner.id">
                    <option value="" key="0" />
                    {companies
                      ? companies.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.legalName}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/transport" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  companies: storeState.company.entities,
  transportEntity: storeState.transport.entity,
  loading: storeState.transport.loading,
  updating: storeState.transport.updating,
  updateSuccess: storeState.transport.updateSuccess
});

const mapDispatchToProps = {
  getCompanies,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransportUpdate);
