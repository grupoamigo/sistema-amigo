import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IServiceRequest } from 'app/shared/model/service-request.model';
import { getEntities as getServiceRequests } from 'app/entities/service-request/service-request.reducer';
import { getEntity, updateEntity, createEntity, reset } from './client.reducer';
import { IClient } from 'app/shared/model/client.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IClientUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IClientUpdateState {
  isNew: boolean;
  serviceRequestId: string;
}

export class ClientUpdate extends React.Component<IClientUpdateProps, IClientUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      serviceRequestId: '0',
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

    this.props.getServiceRequests();
  }

  saveEntity = (event, errors, values) => {
    values.memberSince = convertDateTimeToServer(values.memberSince);

    if (errors.length === 0) {
      const { clientEntity } = this.props;
      const entity = {
        ...clientEntity,
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
    this.props.history.push('/entity/client');
  };

  render() {
    const { clientEntity, serviceRequests, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="sistemaAmigoApp.client.home.createOrEditLabel">
              <Translate contentKey="sistemaAmigoApp.client.home.createOrEditLabel">Create or edit a Client</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : clientEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="client-id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="client-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="memberSinceLabel" for="client-memberSince">
                    <Translate contentKey="sistemaAmigoApp.client.memberSince">Member Since</Translate>
                  </Label>
                  <AvInput
                    id="client-memberSince"
                    type="datetime-local"
                    className="form-control"
                    name="memberSince"
                    placeholder={'YYYY-MM-DD HH:mm'}
                    value={isNew ? null : convertDateTimeFromServer(this.props.clientEntity.memberSince)}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="statusLabel" for="client-status">
                    <Translate contentKey="sistemaAmigoApp.client.status">Status</Translate>
                  </Label>
                  <AvInput
                    id="client-status"
                    type="select"
                    className="form-control"
                    name="status"
                    value={(!isNew && clientEntity.status) || 'ACTIVO'}
                  >
                    <option value="ACTIVO">{translate('sistemaAmigoApp.ClientStatusType.ACTIVO')}</option>
                    <option value="SOLICITUD">{translate('sistemaAmigoApp.ClientStatusType.SOLICITUD')}</option>
                    <option value="APROBADO">{translate('sistemaAmigoApp.ClientStatusType.APROBADO')}</option>
                    <option value="VERIFICADO">{translate('sistemaAmigoApp.ClientStatusType.VERIFICADO')}</option>
                    <option value="DECLINADO">{translate('sistemaAmigoApp.ClientStatusType.DECLINADO')}</option>
                    <option value="CANCELADO">{translate('sistemaAmigoApp.ClientStatusType.CANCELADO')}</option>
                    <option value="PAUSADO">{translate('sistemaAmigoApp.ClientStatusType.PAUSADO')}</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="internalNotesLabel" for="client-internalNotes">
                    <Translate contentKey="sistemaAmigoApp.client.internalNotes">Internal Notes</Translate>
                  </Label>
                  <AvField id="client-internalNotes" type="text" name="internalNotes" />
                </AvGroup>
                <AvGroup>
                  <Label id="uniqueIdLabel" for="client-uniqueId">
                    <Translate contentKey="sistemaAmigoApp.client.uniqueId">Unique Id</Translate>
                  </Label>
                  <AvField id="client-uniqueId" type="text" name="uniqueId" />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/client" replace color="info">
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
  serviceRequests: storeState.serviceRequest.entities,
  clientEntity: storeState.client.entity,
  loading: storeState.client.loading,
  updating: storeState.client.updating,
  updateSuccess: storeState.client.updateSuccess
});

const mapDispatchToProps = {
  getServiceRequests,
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
)(ClientUpdate);
