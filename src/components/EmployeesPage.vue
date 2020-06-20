<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <div class="content">
            <div class="nav-bar">
                <b-nav tabs>
                    <b-nav-item active><a href="/employees">Сотрудники</a></b-nav-item>
                    <b-nav-item><a href="/vacations">Отпуска</a></b-nav-item>
                </b-nav>
            </div>
            <div class="addEmployeeButton">
                <b-button @click="employeeModalShow = !employeeModalShow">Добавить сотрудника</b-button>
            </div>
            <b-table striped hover
                     :items="employees"
                     :fields="fields"
                     :per-page="perPage"
                     head-variant=""
                     :current-page="currentPage">
                <template v-slot:cell(show_details)="row">
                    <b-button size="sm" @click="row.toggleDetails" class="mr-2">
                        {{ row.detailsShowing ? 'Скрыть' : 'Показать'}} отпуска
                    </b-button>
                    <b-button size="sm" class="mr-2" @click="showEditEmployeeModal(row.item)">
                        Изменить
                    </b-button>
                    <b-button variant="danger" size="sm" class="mr-2">
                        Удалить
                    </b-button>
                </template>

                <template v-slot:row-details="row">
                    <b-card>
                        <b-table striped hover
                                 :fields="vacationFields"
                                 :items="row.item.vacations"
                                 :per-page="perPage"
                                 :current-page="currentPage">
                        </b-table>
                        <b-button variant="primary" @click="showVacationAddModal(row.item.id)">Добавить отпуск
                        </b-button>
                    </b-card>
                </template>
            </b-table>
            <div class="pagination">
                <b-pagination
                        v-model="currentPage"
                        :total-rows="rows"
                        :per-page="perPage"
                        aria-controls="my-table"
                ></b-pagination>
            </div>
        </div>
        <b-modal v-model="employeeModalShow"
                 title="Новый сотрудник"
                 @ok="handleOk"
                 @hidden="resetModal"
        >
            <form rel="employeeFrom" autocomplete="false">
                <div class="form-item">
                    <b-form-input v-model="employeeToSave.login"
                                  placeholder="Логинd"
                                  autocomplete="false"></b-form-input>
                </div>
                <div class="form-item">
                    <b-form-input v-model="employeeToSave.password"
                                  type="password"
                                  placeholder="Пароль"
                                  autocomplete="false"></b-form-input>
                </div>
                <div class="form-item">
                    <b-form-input v-model="employeeToSave.fullName" placeholder="ФИО"></b-form-input>
                </div>
                <div class="form-item">
                    <b-form-input v-model="employeeToSave.perNumber" placeholder="Табельный номер"></b-form-input>
                </div>
                <div class="form-item">
                    <b-form-input v-model="employeeToSave.birthday" type="date"
                                  placeholder="Дата рождения"
                    ></b-form-input>
                </div>
            </form>
        </b-modal>
        <b-modal v-model="isAddVacationModal"
                 title="Добавить отпуск"
                 @ok="handleVacationOk"
                 @show="resetVacationModal"
                 @hidden="resetVacationModal"
        >
            <form rel="employeeFrom">
                <div class="form-item">
                    <label>Дата начала отпуска</label>
                    <b-form-input v-model="vacationToSave.startDate" type="date"
                    ></b-form-input>
                </div>
                <div class="form-item">
                    <label>Дата окончания отпуска</label>
                    <b-form-input v-model="vacationToSave.endDate" type="date"
                    ></b-form-input>
                </div>
            </form>
        </b-modal>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "EmployeesPage",

        data() {
            return {
                perPage: 3,
                currentPage: 0,

                employeeState: null,

                employeeModalShow: false,
                isAddVacationModal: false,

                fields: [
                    {
                        key: 'perNumber',
                        sortable: true,
                        label: 'Табельный номер'
                    },
                    {
                        key: 'fullName',
                        label: 'ФИО',
                        sortable: true
                    },
                    {
                        key: 'position',
                        label: 'Должность',
                        sortable: false
                    },
                    {
                        key: 'birthday',
                        label: 'Дата рождения',
                        sortable: true
                    },
                    {
                        key: 'show_details',
                        label: ''
                    }
                ],

                vacationFields: [
                    {
                        key: 'startDate',
                        sortable: true,
                        label: 'Начало отпуска'
                    },
                    {
                        key: 'endDate',
                        label: 'Конец отпуска',
                        sortable: true
                    },
                ],
                employees: [{
                    fullName: 'Иванов Иван Иванович',
                    birthday: 'sdv',
                    position: 'sdv',
                    login: '',
                    password: '',
                    perNumber: '13',
                    vacations: [{startDate: 'ascasc', endDate: 'acasc'}]
                }],

                employeeToSave: {
                    fullName: '',
                    birthday: '',
                    position: '',
                    login: '',
                    password: '',
                    perNumber: ''
                },

                vacationToSave: {
                    employeeId: '',
                    startDate: null,
                    endDate: null,
                }
            }
        },

        mounted() {
            this.getAllEmployees();
        },

        computed: {
            rows() {
                return this.employees.length
            }
        },

        methods: {
            getAllEmployees() {
                axios.get(this.serverUrl + "/employee/", {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    params: {
                        'page': 0,
                        'count': 1000000
                    }
                })
                    .then((response) => {
                        console.log(response);
                        this.employees = response.data
                    })
            },

            resetModal() {
                this.employeeToSave.birthday = null;
                this.employeeToSave.login = null;
                this.employeeToSave.password = null;
                this.employeeToSave.perNumber = null;
                this.employeeToSave.fullName = null;
                this.employeeToSave.position = null;
            },

            resetVacationModal() {
                this.vacationToSave.employeeId = null;
                this.vacationToSave.startDate = null;
                this.vacationToSave.endDate = null;
            },

            handleOk() {
                axios.post(this.serverUrl + "/employee/", this.employeeToSave, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    this.employees.push(response.data)
                });

                this.employeeModalShow = false;
            },

            handleVacationOk() {

            },

            showVacationAddModal(employeeId) {
                this.vacationToSave.employeeId = employeeId;
                this.isAddVacationModal = true;
            },

            showEditEmployeeModal(employee) {
                this.employeeModalShow = true;
                this.employeeToSave.birthday = employee.birthday;
                this.employeeToSave.login = employee.login;
                this.employeeToSave.password = employee.password;
                this.employeeToSave.perNumber = employee.perNumber;
                this.employeeToSave.fullName = employee.fullName;
                this.employeeToSave.position = employee.position;
            }
        }
    }
</script>

<style scoped>
    .content {
        width: 80%;
        margin: 5% auto;
    }

    .form-item {
        margin-top: 2%;
    }

    .addEmployeeButton {
        float: right;
    }

    .nav-bar {
        float: left;
    }

    .pagination {
        margin: 0 auto;
    }
</style>