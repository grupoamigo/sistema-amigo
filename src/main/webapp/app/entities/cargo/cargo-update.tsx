import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IWarehouse } from 'app/shared/model/warehouse.model';
import { getEntities as getWarehouses } from 'app/entities/warehouse/warehouse.reducer';
import { ISeal } from 'app/shared/model/seal.model';
import { getEntities as getSeals } from 'app/entities/seal/seal.reducer';
import { IClient } from 'app/shared/model/client.model';
import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { getEntity, updateEntity, createEntity, reset } from './cargo.reducer';
import { ICargo } from 'app/shared/model/cargo.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ICargoUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface ICargoUpdateState {
  isNew: boolean;
  warehouseId: string;
  warehousesId: string;
  sealsId: string;
  clientId: string;
}

export class CargoUpdate extends React.Component<ICargoUpdateProps, ICargoUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      warehouseId: '0',
      warehousesId: '0',
      sealsId: '0',
      clientId: '0',
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

    this.props.getWarehouses();
    this.props.getSeals();
    this.props.getClients();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { cargoEntity } = this.props;
      const entity = {
        ...cargoEntity,
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
    this.props.history.push('/entity/cargo');
  };

  render() {
    const { cargoEntity, warehouses, seals, clients, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="sistemaAmigoApp.cargo.home.createOrEditLabel">
              <Translate contentKey="sistemaAmigoApp.cargo.home.createOrEditLabel">Create or edit a Cargo</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : cargoEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="cargo-id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="cargo-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="typeLabel" for="cargo-type">
                    <Translate contentKey="sistemaAmigoApp.cargo.type">Type</Translate>
                  </Label>
                  <AvInput
                    id="cargo-type"
                    type="select"
                    className="form-control"
                    name="type"
                    value={(!isNew && cargoEntity.type) || 'CONTENEDOR'}
                  >
                    <option value="CONTENEDOR">{translate('sistemaAmigoApp.CargoType.CONTENEDOR')}</option>
                    <option value="GRANEL">{translate('sistemaAmigoApp.CargoType.GRANEL')}</option>
                    <option value="PALLETS">{translate('sistemaAmigoApp.CargoType.PALLETS')}</option>
                    <option value="TUBERIA">{translate('sistemaAmigoApp.CargoType.TUBERIA')}</option>
                    <option value="CERVEZA">{translate('sistemaAmigoApp.CargoType.CERVEZA')}</option>
                    <option value="LECHE">{translate('sistemaAmigoApp.CargoType.LECHE')}</option>
                    <option value="POLIETILENO">{translate('sistemaAmigoApp.CargoType.POLIETILENO')}</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="uniqueIdLabel" for="cargo-uniqueId">
                    <Translate contentKey="sistemaAmigoApp.cargo.uniqueId">Unique Id</Translate>
                  </Label>
                  <AvField
                    id="cargo-uniqueId"
                    type="text"
                    name="uniqueId"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="descriptionLabel" for="cargo-description">
                    <Translate contentKey="sistemaAmigoApp.cargo.description">Description</Translate>
                  </Label>
                  <AvField id="cargo-description" type="text" name="description" />
                </AvGroup>
                <AvGroup>
                  <Label id="statusLabel" for="cargo-status">
                    <Translate contentKey="sistemaAmigoApp.cargo.status">Status</Translate>
                  </Label>
                  <AvInput
                    id="cargo-status"
                    type="select"
                    className="form-control"
                    name="status"
                    value={(!isNew && cargoEntity.status) || 'ESPERANDO_CARGA'}
                  >
                    <option value="ESPERANDO_CARGA">{translate('sistemaAmigoApp.CargoStatusType.ESPERANDO_CARGA')}</option>
                    <option value="ESPERANDO_DESCARGA">{translate('sistemaAmigoApp.CargoStatusType.ESPERANDO_DESCARGA')}</option>
                    <option value="EN_TRANSITO_MARITIMO">{translate('sistemaAmigoApp.CargoStatusType.EN_TRANSITO_MARITIMO')}</option>
                    <option value="EN_TRANSITO_TERRESTRE">{translate('sistemaAmigoApp.CargoStatusType.EN_TRANSITO_TERRESTRE')}</option>
                    <option value="EN_ADUANA">{translate('sistemaAmigoApp.CargoStatusType.EN_ADUANA')}</option>
                    <option value="ENTREGADO">{translate('sistemaAmigoApp.CargoStatusType.ENTREGADO')}</option>
                    <option value="EN_INSPECCION">{translate('sistemaAmigoApp.CargoStatusType.EN_INSPECCION')}</option>
                    <option value="PERDIDO">{translate('sistemaAmigoApp.CargoStatusType.PERDIDO')}</option>
                    <option value="DANADO">{translate('sistemaAmigoApp.CargoStatusType.DANADO')}</option>
                    <option value="ROBADO">{translate('sistemaAmigoApp.CargoStatusType.ROBADO')}</option>
                    <option value="EN_REPARACION">{translate('sistemaAmigoApp.CargoStatusType.EN_REPARACION')}</option>
                    <option value="TRANSFORMADA">{translate('sistemaAmigoApp.CargoStatusType.TRANSFORMADA')}</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="cargo-warehouse">
                    <Translate contentKey="sistemaAmigoApp.cargo.warehouse">Warehouse</Translate>
                  </Label>
                  <AvInput id="cargo-warehouse" type="select" className="form-control" name="warehouse.id">
                    <option value="" key="0" />
                    {warehouses
                      ? warehouses.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="cargo-seals">
                    <Translate contentKey="sistemaAmigoApp.cargo.seals">Seals</Translate>
                  </Label>
                  <AvInput id="cargo-seals" type="select" className="form-control" name="seals.id">
                    <option value="" key="0" />
                    {seals
                      ? seals.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.uniqueId}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="cargo-client">
                    <Translate contentKey="sistemaAmigoApp.cargo.client">Client</Translate>
                  </Label>
                  <AvInput id="cargo-client" type="select" className="form-control" name="client.id">
                    <option value="" key="0" />
                    {clients
                      ? clients.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.uniqueId}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="cargo-warehouses">
                    <Translate contentKey="sistemaAmigoApp.cargo.warehouses">Warehouses</Translate>
                  </Label>
                  <AvInput id="cargo-warehouses" type="select" className="form-control" name="warehouses.id">
                    <option value="" key="0" />
                    {warehouses
                      ? warehouses.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/cargo" replace color="info">
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
  warehouses: storeState.warehouse.entities,
  seals: storeState.seal.entities,
  clients: storeState.client.entities,
  cargoEntity: storeState.cargo.entity,
  loading: storeState.cargo.loading,
  updating: storeState.cargo.updating,
  updateSuccess: storeState.cargo.updateSuccess
});

const mapDispatchToProps = {
  getWarehouses,
  getSeals,
  getClients,
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
)(CargoUpdate);
